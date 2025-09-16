const clamp0100 = v => Math.min(100, Math.max(0, Number.isFinite(v) ? v : 0));
const $ = id => document.getElementById(id);

const leccion = $("leccion"), examen = $("examen"), mejora = $("mejora"),
      pruebas = $("pruebas"), controles = $("controles"),
      talleres = $("talleres"), tareas = $("tareas");

const resultado = $("resultado"), estado = $("estado"),
      sub70 = $("sub70"), sub30 = $("sub30"),
      origen = $("origen"), necesita = $("necesita");

function calcularNota(){
  const nLeccion = clamp0100(parseFloat(leccion.value));
  const nExamen  = clamp0100(parseFloat(examen.value));
  const nMejora  = clamp0100(parseFloat(mejora.value));
  const nPruebas = clamp0100(parseFloat(pruebas.value));
  const nControles = clamp0100(parseFloat(controles.value));
  const nTalleres = clamp0100(parseFloat(talleres.value));
  const nTareas = clamp0100(parseFloat(tareas.value));

  // Componente 30% (0..30 puntos)
  const comp30 = nPruebas*0.10 + nControles*0.05 + nTalleres*0.05 + nTareas*0.10;

  // Componente 70% normal (0..70 puntos)
  const comp70normal = nLeccion*0.20 + nExamen*0.50;

  // Mejoramiento (0..100) -> convertido a 0..70
  const comp70mejora = nMejora * 0.70;

  // Usar el mayor
  const usaMejora = comp70mejora > comp70normal;
  const comp70 = usaMejora ? comp70mejora : comp70normal;

  // Nota final precisa
  const notaFinal = comp70 + comp30;

  // Redondear a 1 decimal
  const notaFinalRedondeada = Math.round(notaFinal * 10) / 10;

  resultado.textContent = notaFinalRedondeada.toFixed(1);
  sub70.textContent = `${comp70.toFixed(1)} / 70`;
  sub30.textContent = `${comp30.toFixed(1)} / 30`;
  origen.textContent = usaMejora ? "Examen de Mejoramiento" : "Lección + Examen final";

  if (notaFinalRedondeada >= 60){
    estado.textContent = "Aprobada";
    estado.className = "state ok";
    necesita.textContent = "";
  } else {
    estado.textContent = "Reprobada";
    estado.className = "state bad";

    // ¿Qué necesito en el Mejoramiento?
    const req = (60 - comp30) / 0.70;
    if (req > 100){
      necesita.textContent = "Aunque saques 100 en el Mejoramiento, no alcanzarías 60.";
    } else {
      const reqClamped = Math.max(0, req);
      necesita.textContent = `Necesitas al menos ${reqClamped.toFixed(1)} en el Mejoramiento para aprobar.`;
    }
  }
}

[leccion, examen, mejora, pruebas, controles, talleres, tareas].forEach(i=>{
  i.addEventListener("input", calcularNota);
});
$("calcular").addEventListener("click", calcularNota);

$("toggleTheme").addEventListener("click", ()=>{
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  $("toggleTheme").textContent = document.body.classList.contains("dark-mode") ? "Modo claro" : "Modo oscuro";
});

calcularNota();
