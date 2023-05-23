import { NodeJasperSt } from './index'
import * as dotenv from 'dotenv'
import path from 'path';
dotenv.config()

enum reports {
  Hello = "examples/hello_world.jrxml",
  Contactos = "examples/json.jrxml",
}

enum data {
  Contactos = 'contacts.json',
}

const output = 'output';

async function compileJasper(njst: NodeJasperSt) {
  await njst.compile(reports.Contactos, output);
  let result = await njst.execute()
  console.log(result)
}

async function processJasper(njst: NodeJasperSt) {
  njst.process(reports.Contactos, output, {
    db_connection: {
      'driver': 'json',
      'data_file': path.join('examples', data.Contactos), 
    }
  });
  
  let result = await njst.execute()
  console.log(result)
}

async function init() {
  const njst = new NodeJasperSt()
  await compileJasper(njst);
  await processJasper(njst);
}
init();