import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { Script } from 'node:vm';

const result = await build({ entryPoints: ['src/app.js'], bundle: true, format: 'iife', target: ['es2020'], minify: true, legalComments: 'inline', write: false });
const html = await readFile('src/template.html', 'utf8');
const css = await readFile('src/styles.css', 'utf8');
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const output = html.replace('/* INLINE_STYLES */', () => css).replace('/* INLINE_APP */', () => js);
// Validate the actual embedded program, including escaping and substitution.
new Script(output.split('<script>')[1].split('</script>')[0]);
await writeFile('index.html', output);
await mkdir('dist', {recursive:true});
await writeFile('dist/index.html', output);
console.log(`index.html listo: ${Math.round(Buffer.byteLength(js + css + html) / 1024)} KB. Sin recursos de red necesarios.`);
