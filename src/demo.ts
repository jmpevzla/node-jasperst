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

async function checkJasper(njst: NodeJasperSt) {
  let result = ''
  //await njst.compile(reports.Contactos, output);
  njst.process(reports.Contactos, output, {
    db_connection: {
      'driver': 'json',
      'data_file': path.join(output, data.Contactos), 
    }
  });
  
  result = await njst.execute()
  console.log(result)
}

const njst = new NodeJasperSt()
checkJasper(njst);
