function showSection(id) {
  document.querySelectorAll('section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

function resolverNewtonRaphson() {
  const fStr = document.getElementById("funcion").value.trim();
  const x0Str = document.getElementById("x0").value;
  const iterMaxStr = document.getElementById("iteraciones").value;
  const errorMinStr = document.getElementById("errorMin").value;
  const procedimiento = document.getElementById("procedimiento");

  if (fStr === "") {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ Por favor ingresa una función.</div>`;
    return;
  }

  const regex = /^[0-9xX+\-*/^().\s]+$/;
  if (!regex.test(fStr)) {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ La función contiene caracteres inválidos.</div>`;
    return;
  }

  const x0 = parseFloat(x0Str);
  if (x0Str === "" || isNaN(x0)) {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ Ingresa un valor inicial válido para x₀.</div>`;
    return;
  }

  const iterMax = parseInt(iterMaxStr);
  const errorMin = parseFloat(errorMinStr);
  const iterValid = iterMaxStr !== "" && !isNaN(iterMax);
  const errorValid = errorMinStr !== "" && !isNaN(errorMin);

  if (!iterValid && !errorValid) {
    procedimiento.innerHTML = `<div class="step" style="color:red;">❌ Ingresa al menos iteraciones máximas o error mínimo.</div>`;
    return;
  }

  
  const match = fStr.replace(/\s+/g, '').match(/^([+-]?\d*\.?\d*)x\^2([+-]?\d*\.?\d*)x([+-]?\d*\.?\d*)$/i);
  if (match) {
    const a = parseFloat(match[1] || '1');
    const b = parseFloat(match[2] || '0');
    const c = parseFloat(match[3] || '0');
    const delta = b * b - 4 * a * c;
    if (delta < 0) {
      procedimiento.innerHTML = `<div class="step" style="color:red;">❌ La función cuadrática no tiene raíces reales (Δ = ${delta.toFixed(2)} &lt; 0). El método no puede aplicarse sobre ℝ.</div>`;
      return;
    }
  }

  

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
  let valoresAnteriores = [];

  pasos += `<div class="step">Función: f(x) = <code>${fStr}</code><br>Derivada: <code>${fPrimeStr}</code></div>`;

  const fx0 = f.evaluate({ x: x0 });
  const fpx0 = fPrime.evaluate({ x: x0 });

  if (Math.abs(fx0) > 1000) {
    pasos += `<div class="step" style="color:orange;">⚠️ Advertencia: f(x₀) = ${fx0.toFixed(2)} está muy lejos de cero. Puede que no haya una raíz cercana.</div>`;
  }

  if ((fx0 > 0 && fpx0 > 0 || fx0 < 0 && fpx0 < 0) && Math.abs(fpx0) < 0.5) {
    pasos += `<div class="step" style="color:orange;">⚠️ Advertencia: La función y su derivada en x₀ tienen la misma dirección y f'(x₀) es pequeña. Posible mala elección de x₀.</div>`;
  }

  while ((!iterValid || i < iterMax) && (errorValid ? error > errorMin : true)) {
    const fx = f.evaluate({ x });
    const fpx = fPrime.evaluate({ x });

    pasos += `<div class="step"><strong>Iteración ${i + 1}:</strong><br>
              f(${x.toFixed(6)}) = ${fx.toFixed(6)}<br>
              f'(${x.toFixed(6)}) = ${fpx.toFixed(6)}<br>`;

    if (Math.abs(fpx) < 1e-8) {
      pasos += `<span style="color:red;">❌ Derivada cercana o igual a cero.</span></div>`;
      procedimiento.innerHTML = pasos;
      return;
    }

    const salto = Math.abs(fx / fpx);
    if (i === 0 && salto > 1000) {
      pasos += `<span style="color:red;">❌ El salto en la primera iteración es demasiado grande (≈ ${salto.toFixed(2)}). Posible divergencia.</span></div>`;
      procedimiento.innerHTML = pasos;
      return;
    }

    const x1 = x - (fx / fpx);
    error = Math.abs((x1 - x) / x1) * 100;

    pasos += `x₁ = ${x.toFixed(6)} - (${fx.toFixed(6)} / ${fpx.toFixed(6)}) = ${x1.toFixed(6)}<br>
              Error = ${error.toFixed(6)}%</div>`;

    if (!isFinite(x1) || isNaN(x1)) {
      pasos += `<span style="color:red;">❌ Resultado no válido: NaN o infinito.</span></div>`;
      procedimiento.innerHTML = pasos;
      return;
    }

    valoresAnteriores.push(x1);
    if (valoresAnteriores.length > 4) valoresAnteriores.shift();
    if (valoresAnteriores.length === 4) {
      const difs = valoresAnteriores.slice(1).map((v, idx) => Math.abs((v - valoresAnteriores[idx]) / v) * 100);
      if (difs.every(d => d < 0.5)) {
        pasos += `<div class="step" style="color:orange;">⚠️ El método se detuvo: los últimos 4 valores son casi iguales (variación &lt; 0.5%).</div>`;
        break;
      }
    }

    x = x1;
    i++;
  }

  if (errorValid && error > errorMin) {
    pasos += `<div class="step" style="color:red;">⚠️ No se alcanzó el error mínimo de ${errorMin}%. El resultado podría no ser una raíz.</div>`;
  }

  procedimiento.innerHTML = pasos;
}
