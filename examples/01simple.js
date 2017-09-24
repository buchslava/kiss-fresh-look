const stdin = process.stdin;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

const lights = ['red', 'yellow', 'green', 'yellow'];

let globalCurrentLight = 0;
let globalTimeout = null;

const timeout = (currentLight) => {
  const nextLight = currentLight + 1 < lights.length ? currentLight + 1 : 0;
  const timeoutValue = nextLight === 0 || nextLight === 2 ? 2000 : 5000;

  globalCurrentLight = currentLight;

  console.log(lights[currentLight], new Date());

  globalTimeout = setTimeout(() => {
      timeout(nextLight);
  }, timeoutValue);
};

stdin.on('data', key => {
  if ( key === '\u0003' ) {
    process.exit();
  }

  if (globalCurrentLight === 0 || globalCurrentLight === 3) {
    clearTimeout(globalTimeout);

    timeout(1);
  }
});

timeout(0);
