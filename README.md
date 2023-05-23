# Node-JasperSt

> Based on [PHPJasper Lib](https://github.com/PHPJasper/phpjasper)

_A NodeJS Report Generator_

### About
Node-JasperSt is the best solution to compile and process JasperReports (.jrxml & .jasper files) just using nodejs, in short: to generate reports using nodejs.

### Why Node-JasperSt?

Did you ever had to create a good looking Invoice with a lot of fields for your great web app?

I had to, and the solutions out there were not perfect. Generating *HTML* + *CSS* to make a *PDF*? That doesn't make any sense! :)

Then I found **JasperReports** the best open source solution for reporting.

### What can I do with this?

Well, everything. JasperReports is a powerful tool for **reporting** and **BI**.

**From their website:**

> The JasperReports Library is the world's most popular open source reporting engine. It is entirely written in Java and it is able to use data coming from any kind of data source and produce pixel-perfect documents that can be viewed, printed or exported in a variety of document formats including HTML, PDF, Excel, OpenOffice and Word.

It is recommended using [Jaspersoft Studio](http://community.jaspersoft.com/project/jaspersoft-studio) to build your reports, connect it to your datasource (ex: MySQL, POSTGRES), loop thru the results and output it to PDF, XLS, DOC, RTF, ODF, etc.

*Some examples of what you can do:*

* Invoices
* Reports
* Listings

## Requirements

* NodeJS 14 or above
* Java JDK 1.8

## Optional

* Any `jdbc` drivers to generate reports from a database (MySQL, PostgreSQL, MSSQL...), must be copied to a folder `jasperstarter/jdbc`
* We ship the [PostgreSQL](https://jdbc.postgresql.org/) (42.2.9) in the `jasperstarter/jdbc` directory.
* We ship the [MySQL connector](http://dev.mysql.com/downloads/connector/j/) (v5.1.48) in the `jasperstarter/jdbc` directory.
* [Microsoft JDBC Drivers SQL Server
](https://docs.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-ver15).
* [Jaspersoft Studio](http://community.jaspersoft.com/project/jaspersoft-studio) version 6.6.0 (to draw your reports).

## Installation

Just run:
```bash
npm install node-jasperst
```

You should have installed dotenv for config Java Runtime Enviroment 8 (JRE) path
```bash
npm install dotenv
```

## Examples

- in src/demo.ts you can see some examples:

```js
import { NodeJasperSt } from 'node-jasperst'
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
  result = await njst.execute()
  console.log(result)
}

async function processJasper(njst: NodeJasperSt) {
  let result = ''
  njst.process(reports.Contactos, output, {
    db_connection: {
      'driver': 'json',
      'data_file': path.join('examples', data.Contactos), 
    }
  });
  
  result = await njst.execute()
  console.log(result)
}

async function init() {
  const njst = new NodeJasperSt()
  await compileJasper(njst);
  await processJasper(njst);
}
init();
```

- for more examples, please see PHPJasper README.md Examples.

