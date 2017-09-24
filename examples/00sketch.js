const lights = ['red', 'yellow', 'green', 'yellow'];

const timeout = (currentLight) => {
  const nextLight = currentLight + 1 < lights.length ? currentLight + 1 : 0;
  const timeoutValue = nextLight === 1 || nextLight === 3 ? 500 : 3000;

  setTimeout(() => {
    console.log(lights[currentLight], new Date());

    timeout(nextLight);
  }, timeoutValue);
}

timeout(0);
