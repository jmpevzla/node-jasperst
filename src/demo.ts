import { NodeJasperSt } from './index'
import * as dotenv from 'dotenv'
dotenv.config()

async function checkJasper(njst: NodeJasperSt) {
  let result = ''
  njst.checkServer()
  
  result = await njst.execute()
  console.log(result)
}

const njst = new NodeJasperSt()
checkJasper(njst);
