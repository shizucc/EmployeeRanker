const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('karyawan_db')
const { faker } = require('@faker-js/faker');
const yargs = require('yargs')
const Table = require('cli-table3')
const count = require('./count.js')

db.serialize(()=>{
    db.run('CREATE TABLE IF NOT EXISTS karyawan (nama varchar(255), absensi INT, sikap INT, komunikasi INT, kualitas_kerja INT, kerja_sama INT)',(res,err)=>{
        if (err) throw err
    })
})

const getData = () => {
    const nama = faker.person.fullName()
    const absensi = faker.number.int({min:20, max:31})
    const sikap = faker.number.int({max:125})
    const komunikasi = faker.number.int({max:125})
    const kualitas_kerja = faker.number.int({max:125})
    const kerja_sama = faker.number.int({max:125})

    return [nama,absensi,sikap,komunikasi,kualitas_kerja,kerja_sama]
}
    const seed = () => {
        db.serialize(()=>{
            for (let i = 0; i < 100 ; i++) {
                const [nama,absensi,sikap,komunikasi,kualitas_kerja,kerja_sama] = getData()
                const statement = db.prepare("INSERT INTO karyawan (nama, absensi, sikap, komunikasi, kualitas_kerja, kerja_sama) VALUES (?,?,?,?,?,?)", (err)=> console.log(err))
                statement.run(nama, absensi, sikap, komunikasi, kualitas_kerja, kerja_sama)
                statement.finalize()       
            }
            db.close()
        })
    }
    const showAll = () => {
        const table = new Table({
            head : ['nama','absensi', 'sikap', 'komunikasi', 'kualitas_kerja', 'kerja_sama']
        })
        db.serialize(()=>{
            db.all("SELECT * FROM karyawan", (err, rows) => {
                rows.forEach((row) =>{
                    table.push([row.nama, row.absensi, row.sikap, row.komunikasi, row.kualitas_kerja, row.kerja_sama])
                })
                console.log(table.toString())
            })
        })
        db.close()
    }

    yargs
    .command(
      'all',
      'all karyawan',
      () => {
              showAll()
          },
      )

    yargs
    .command(
      'count',
      'Count By Topsis',
      () => {
              count()
          },
      )
  
  yargs.parse()
  