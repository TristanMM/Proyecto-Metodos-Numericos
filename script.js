// Funcion para hacer los cambios de seccion en la pagina al hacerles "click"
function showSection(id) {
    document.querySelectorAll('section').forEach(sec => {
      sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }

  //Funcion que implementa la logica para realizar el metodo de Newton-Rhapson
  function resolverNewtonRaphson() {
  const fStr = document.getElementById("funcion").value.trim();
  const x0Str = document.getElementById("x0").value;
  const iterMaxStr = document.getElementById("iteraciones").value;
  const errorMinStr = document.getElementById("errorMin").value;

  const procedimiento = document.getElementById("procedimiento");

  // Validar función vacía
  if (fStr === "") {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ Por favor ingresa una función.</div>`;
    return;
  }

  // Validar caracteres válidos en la función
  const regex = /^[0-9xX+\-*/^().\s]+$/;
  if (!regex.test(fStr)) {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ La función contiene caracteres inválidos. Solo se permiten números, x, + - * / ^ , paréntesis y espacios.</div>`;
    return;
  }

  // Validar x0
  const x0 = parseFloat(x0Str);
  if (x0Str === "" || isNaN(x0)) {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ Ingresa un valor inicial válido para x₀.</div>`;
    return;
  }

  // Validar iteraciones y error mínimo (al menos uno debe estar lleno)
  const iterMax = parseInt(iterMaxStr);
  const errorMin = parseFloat(errorMinStr);

  const iterValid = iterMaxStr !== "" && !isNaN(iterMax);
  const errorValid = errorMinStr !== "" && !isNaN(errorMin);

  if (!iterValid && !errorValid) {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ Ingresa al menos las iteraciones máximas o el error mínimo.</div>`;
    return;
  }

  // Compilar funciones
  let f, fPrimeStr, fPrime;
  try {
    f = math.parse(fStr).compile();
    fPrimeStr = math.derivative(fStr, 'x').toString();
    fPrime = math.parse(fPrimeStr).compile();
  } catch (err) {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ Error al interpretar la función</div>`;
    return;
  }

  let x = x0;
  let error = 100;
  let pasos = "";
  let i = 0;

  pasos += `<div class="step">Función: f(x) = <code>${fStr}</code><br>Derivada de f(x): <code>${fPrimeStr}</code></div>`;

  while ((iterValid && i < iterMax) || (errorValid && error > errorMin)) {
    const fx = f.evaluate({ x });
    const fpx = fPrime.evaluate({ x });

    pasos += `<div class="step"><strong>Iteración ${i + 1}:</strong><br>
              f(${x.toFixed(2)}) = ${fx.toFixed(2)}<br>
              f'(${x.toFixed(2)}) = ${fpx.toFixed(2)}<br>`;

    const x1 = x - (fx / fpx);
    error = Math.abs((x1 - x) / x1) * 100;

    pasos += `x₁ = ${x.toFixed(2)} - (${fx.toFixed(2)} / ${fpx.toFixed(2)}) = ${x1.toFixed(2)}<br>
              Error = ${error.toFixed(2)}%</div>`;

    x = x1;
    i++;
  }

  procedimiento.innerHTML = pasos;
}
