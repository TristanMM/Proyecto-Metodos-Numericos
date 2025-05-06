// Funcion para hacer los cambios de seccion en la pagina al hacerles "click"
function showSection(id) {
    document.querySelectorAll('section').forEach(sec => {
      sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }

  //Funcion que implementa la logica para realizar el metodo de Newton-Rhapson
  function resolverNewtonRaphson() {
    const fStr = document.getElementById("funcion").value;
    const x0 = parseFloat(document.getElementById("x0").value);
    const iterMax = parseInt(document.getElementById("iteraciones").value);
    const errorMin = parseFloat(document.getElementById("errorMin").value);
    const f = math.parse(fStr).compile();
    const fPrimeStr = math.derivative(fStr, 'x').toString();
    const fPrime = math.parse(fPrimeStr).compile();
    
    let x = x0;
    let error = 100;
    let pasos = "";
    let i = 0;

    pasos += `<div class="step">Función: f(x) = <code>${fStr}</code><br>Derivada de f(x): <code>${fPrimeStr}</code></div>`;

    // condicion para realizar el metodo hasta que realiza la cantidad de iteraciones o al llegar al porcentaje minimo que digito el usuario.
    while (i < iterMax || error > errorMin) {
      const fx = f.evaluate({ x });
      const fpx = fPrime.evaluate({ x });

      //Muestra cada aumento de iteracion al sumarle 1 a la iteracion anterior
      //x.toFixed(2) lo que hace es limitar el numero de decimales de los valores a 2 decimales
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

    document.getElementById("procedimiento").innerHTML = pasos;
  }