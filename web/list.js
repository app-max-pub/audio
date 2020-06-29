function rec(folder) {
    console.log(folder)
    let output = {};
    for (let file of Deno.readDirSync(folder)) {
        if (file.isFile)
            output[file.name] = Deno.statSync(folder + '/' + file.name).size
        if (file.isDirectory)
            output[file.name] = rec(folder + '/' + file.name);
    }
    // console.log(file)
    return output;
}
function rec2(folder) {
    // console.log(folder)
    let output = [];
    for (let file of Deno.readDirSync(folder)) {
        if (file.isFile) output.push(file.name)
        if (file.isDirectory) output.push(rec2(folder + '/' + file.name))
    }
    // console.log(file)
    return output;
}
let list = rec(Deno.args[0])
let json = JSON.stringify(list, null, '\t');
console.log(json);
Deno.writeTextFileSync(Deno.args[0]+'/index.json', json)