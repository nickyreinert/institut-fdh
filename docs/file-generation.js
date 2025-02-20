// Function to generate random file/folder names
function generateRandomName(isFolder = false) {
  const dosFolderNames = [
    'DOS', 'COMMAND', 'CONFIG', 'SYSTEM', 'GAMES', 'UTIL', 'MOUSE', 'DRIVER',
    'FONT', 'AUTOEXEC', 'WINDOWS', 'TEMP', 'TMP', 'USER', 'BIN', 'INCLUDE',
    'LIB', 'SRC', 'DOC', 'PROJECT', 'DATA', 'BACKUP', 'ARCHIVE', 'NETWORK',
    'PROGRAM', 'TOOLS', 'BASIC', 'PASCAL', 'CPP', 'ASM', 'DEBUG', 'EDIT',
    'HELP', 'PRINT', 'BATCH', 'APPS', 'WORD', 'EXCEL', 'LOTUS', 'DBASE',
    'NORTON', 'PCTOOLS', 'QBASIC', 'BORLAND', 'TURBO', 'MSCDEX', 'DRIVERS',
    'IMAGES', 'TEXT', 'MAIL', 'MODEM', 'COM', 'GAME', 'SIERRA', 'LUCASART'
  ];

  const dosFileNames = [
    'COMMAND', 'CONFIG', 'SYSTEM', 'HIMEM', 'EMM386', 'SMARTDRV', 'MSCDEX',
    'ANSI', 'COUNTRY', 'DISPLAY', 'KEYBOARD', 'PRINTER', 'MOUSE', 'SOUND',
    'GAME', 'UTIL', 'README', 'INSTALL', 'SETUP', 'DEMO', 'SHARE', 'REPORT',
    'LETTER', 'DOCUMENT', 'DATA', 'BACKUP', 'ARCHIVE', 'AUTOEXEC', 'FORMAT',
    'CHKDSK', 'DEFRAG', 'SCANDISK', 'UNDELETE', 'UNFORMAT', 'EDIT', 'DEBUG',
    'QBASIC', 'BASIC', 'PASCAL', 'MASM', 'TASM', 'LINK', 'MAKE', 'BUILD',
    'DOOM', 'WOLF3D', 'PRINCE', 'MONKEY', 'LEMMINGS', 'TETRIS', 'PACMAN',
    'LOTUS', 'DBASE', 'WORDPERF', 'NOTEPAD', 'CALC', 'CALENDAR', 'TERMINAL',
    'TELNET', 'FTP', 'PING', 'IPCONFIG', 'NETSTAT', 'EDIT', 'HELP', 'DIR'
  ];

  const dosExtensions = isFolder ? [''] : [
    '.COM', '.EXE', '.BAT', '.SYS', '.TXT', '.INI', '.CFG', '.LOG',
    '.DAT', '.DBF', '.IDX', '.BAK', '.OLD', '.TMP', '.DOC', '.WK1',
    '.WK3', '.XLS', '.DBF', '.MDB', '.BAS', '.PAS', '.C', '.CPP', 
    '.ASM', '.OBJ', '.LIB', '.DLL', '.DRV', '.386', '.VXD', '.FON',
    '.BMP', '.PCX', '.GIF', '.ZIP', '.ARJ', '.PAK', '.SAV', '.WRI'
  ];

  const names = isFolder ? dosFolderNames : dosFileNames;
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomExtension = dosExtensions[Math.floor(Math.random() * dosExtensions.length)];

  // 8.3 filename format (truncate if necessary)
  return `${randomName.slice(0, 8)}${randomExtension}`; 
}

function generateLongFilename(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  const extensions = ['.DOC', '.EXE', '.COM', '.BAT', '.TXT', '.DAT'];
  let name = '';
  for (let i = 0; i < length; i++) {
    name += chars[Math.floor(Math.random() * chars.length)];
  }
  return name + extensions[Math.floor(Math.random() * extensions.length)];
} 