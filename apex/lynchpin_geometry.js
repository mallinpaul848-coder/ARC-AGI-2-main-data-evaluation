/** APEX Lynchpin Geometry reasoning research module. */
export function lynchpinGeometry(problem) {
  const text = String(problem ?? '');
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const anchors = tokens.filter(t => /^(why|because|therefore|if|then|only|unless|must|cannot|except)$/i.test(t));
  const symmetry = /symmetr|triangle|circle|angle|parallel|perpendicular|rotate|reflect|scale|distance|coordinate/i.test(text);
  const constraints = (text.match(/\b(if|only|unless|must|cannot|exactly|at least|at most)\b/gi)||[]).length;
  return {operator:'LYNCHPIN-GEOMETRY-1',anchors:anchors.slice(0,32),symmetry_signal:symmetry,constraint_density:constraints/Math.max(1,tokens.length),checks:['anchor extraction','constraint consistency','symmetry/invariant scan','counterexample prompt'],status:'research-module'};
}
export function reasoningChecklist(problem) {
  const g=lynchpinGeometry(problem);
  return ['Define the objective and unknowns.','Extract hard constraints before inference.','Search for invariants, symmetry, and conserved structure.','Generate at least one alternative hypothesis.','Attempt a counterexample.','Verify the conclusion against every stated constraint.','Lynchpin geometry signal: '+(g.symmetry_signal?'present':'not detected')+'.'];
}