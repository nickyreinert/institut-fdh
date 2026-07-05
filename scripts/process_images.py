import json
import os
import requests
import io
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright
from PIL import Image

# --- CONFIGURATION ---
TARGET_WIDTH = 600
TARGET_HEIGHT = 338 
# ---------------------

def get_image_from_page(page):
    """
    Checks if the website contains a featured image.
    """
    img_url = page.evaluate("""
        () => {
            const meta = document.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
            if (meta && meta.content) return meta.content;
            
            const selectors = ['article img', 'main img', '.entry-content img', '.post-content img', 'img'];
            for (let sel of selectors) {
                const img = document.querySelector(sel);
                if (img && img.src) { 
                    return img.src;
                }
            }
            return null;
        }
    """)
    return img_url

def process_and_save_image(input_data, output_path):
    """
    Crops to target aspect ratio, resizes, converts to RGB, and saves as compressed JPG.
    """
    try:
        if isinstance(input_data, bytes):
            img = Image.open(io.BytesIO(input_data))
        else:
            img = Image.open(input_data)
            
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")
            
        img_ratio = img.width / img.height
        target_ratio = TARGET_WIDTH / TARGET_HEIGHT
        
        if img_ratio > target_ratio:
            new_width = int(img.height * target_ratio)
            offset = (img.width - new_width) // 2
            box = (offset, 0, offset + new_width, img.height)
        else:
            new_height = int(img.width / target_ratio)
            offset = (img.height - new_height) // 2
            box = (0, offset, img.width, offset + new_height)
            
        img_cropped = img.crop(box)
        img_resized = img_cropped.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
        
        img_resized.save(output_path, "JPEG", quality=85, optimize=True)
        return True
    except Exception as e:
        print(f"   [!] Error processing image: {e}")
        return False

def download_and_process_image(url, save_path):
    """Downloads an image and processes it in memory."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            return process_and_save_image(response.content, save_path)
    except Exception as e:
        print(f"   [!] Error downloading image {url}: {e}")
    return False

def process_files(json_files, force_update=False):
    # Base directory for all images
    base_dir = "docs/gfx/screenshots"
    os.makedirs(base_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 720}, 
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        
        for file_path in json_files:
            print(f"\n--- Processing {file_path} ---")
            if not os.path.exists(file_path):
                print(f"[!] File {file_path} not found. Skipping.")
                continue
                
            with open(file_path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
            
            data_list = None
            if isinstance(raw_data, list):
                data_list = raw_data
            elif isinstance(raw_data, dict):
                for key, value in raw_data.items():
                    if isinstance(value, list) and len(value) > 0 and isinstance(value[0], dict):
                        data_list = value
                        break
            
            if not data_list:
                print(f"   [!] Could not find a list of items in {file_path}. Skipping.")
                continue

            updated = False
            
            for item in data_list:
                current_image = item.get("image", "")
                
                if not current_image or "placeholder" in current_image.lower() or force_update:
                    url = item.get("url")
                    item_id = item.get("id", "unknown")
                    
                    # --- NEW: Extract and sanitize the category for the subfolder ---
                    category = item.get("category", "uncategorized")
                    safe_category = "".join(c for c in category if c.isalnum() or c in "-_").rstrip().lower()
                    if not safe_category:
                        safe_category = "uncategorized"
                    # ------------------------------------------------------------------
                    
                    if not url:
                        print(f"   [!] No URL found for item {item_id}. Skipping.")
                        continue
                    
                    safe_id = "".join(c for c in item_id if c.isalnum() or c in "-_").rstrip()
                    
                    # --- NEW: Define the specific subfolder for this category ---
                    save_dir = f"{base_dir}/{safe_category}"
                    os.makedirs(save_dir, exist_ok=True)
                    
                    save_path = f"{save_dir}/{safe_id}.jpg"
                    temp_path = f"{save_dir}/{safe_id}_temp.png"
                    # -------------------------------------------------------------
                    
                    page = context.new_page()
                    try:
                        print(f"   Navigating to {url}...")
                        page.goto(url, wait_until="load", timeout=30000)
                        page.wait_for_timeout(2500) 
                        
                        img_url = get_image_from_page(page)
                        
                        if img_url:
                            img_url = urljoin(url, img_url)
                            print(f"   -> Found image on site. Saving to {save_path}...")
                            
                            if download_and_process_image(img_url, save_path):
                                item["image"] = save_path
                                updated = True
                            else:
                                print("   -> Download failed, falling back to screenshot.")
                                page.screenshot(path=temp_path, full_page=False)
                                process_and_save_image(temp_path, save_path)
                                if os.path.exists(temp_path): os.remove(temp_path)
                                item["image"] = save_path
                                updated = True
                        else:
                            print(f"   -> No image found. Taking screenshot to {save_path}...")
                            page.screenshot(path=temp_path, full_page=False)
                            process_and_save_image(temp_path, save_path)
                            if os.path.exists(temp_path): os.remove(temp_path)
                            item["image"] = save_path
                            updated = True
                            
                    except Exception as e:
                        print(f"   [!] Error processing {url}: {e}")
                    finally:
                        page.close()
            
            if updated:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(raw_data, f, ensure_ascii=False, indent=4)
                print(f"[+] Successfully updated {file_path}")
            else:
                print(f"[-] No updates needed for {file_path}")
                
        browser.close()
        print("\nAll done!")

if __name__ == "__main__":
    JSON_FILES = [
        "docs/data-nerdenz.json",
        "docs/data-analysis.json",
        "docs/data-tools.json"
    ]
    
    process_files(JSON_FILES, force_update=False)