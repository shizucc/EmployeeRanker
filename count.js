const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('karyawan_db')

db.serialize(()=>{
    db.run('CREATE TABLE IF NOT EXISTS karyawan (nama varchar(255), absensi INT, sikap INT, komunikasi INT, kualitas_kerja INT, kerja_sama INT)',(res,err)=>{
        if (err) throw err
    })
})

const count = () => {
    db.serialize(()=>{
        db.all("SELECT * FROM karyawan", (err, rows) => {
            const tabel = {
                Nama: Array(),
                C1: Array(),
                C2: Array(),
                C3: Array(),
                C4: Array(),
                C5: Array()
            }

            rows.forEach((row) =>{
                tabel.Nama.push(row.nama);
                tabel.C1.push(row.absensi);
                tabel.C2.push(row.sikap);
                tabel.C3.push(row.komunikasi);
                tabel.C4.push(row.kualitas_kerja);
                tabel.C5.push(row.kerja_sama);
            })

            console.log("\n\n=== DATA PENILAIAN KARYAWAN ===\n");
            console.log(tabel);
            
            // Mengkonversi sesuai bobot
            const jmlData = rows.length;
            for (let i = 0; i < jmlData; i++) {
                //C1
                if (tabel.C1[i] >= 25) {
                    tabel.C1[i] = 5;
                } else if (tabel.C1[i] <= 24 && tabel.C1[i] >= 22) {
                    tabel.C1[i] = 4;
                } else if (tabel.C1[i] <= 21 && tabel.C1[i] >= 19) {
                    tabel.C1[i] = 3;
                } else if (tabel.C1[i] <= 18 && tabel.C1[i] >= 15) {
                    tabel.C1[i] = 2;
                } else {
                    tabel.C1[i] = 1;
                }

                //C2
                if (tabel.C2[i] <= 125 && tabel.C2[i] >= 101){
                    tabel.C2[i] = 5;
                } else if (tabel.C2[i] <= 100 && tabel.C2[i] >=76){
                    tabel.C2[i] = 4;
                } else if (tabel.C2[i] <= 75 && tabel.C2[i] >=51){
                    tabel.C2[i] = 3;
                } else if (tabel.C2[i] <= 50 && tabel.C2[i] >=26){
                    tabel.C2[i] = 2;
                } else {
                    tabel.C2[i] = 1;
                }

                //C3
                if (tabel.C3[i] <= 125 && tabel.C3[i] >= 101){
                    tabel.C3[i] = 5;
                } else if (tabel.C3[i] <= 100 && tabel.C3[i] >=76){
                    tabel.C3[i] = 4;
                } else if (tabel.C3[i] <= 75 && tabel.C3[i] >=51){
                    tabel.C3[i] = 3;
                } else if (tabel.C3[i] <= 50 && tabel.C3[i] >=26){
                    tabel.C3[i] = 2;
                } else {
                    tabel.C3[i] = 1;
                }

                //C4
                if (tabel.C4[i] <= 125 && tabel.C4[i] >= 101){
                    tabel.C4[i] = 5;
                } else if (tabel.C4[i] <= 100 && tabel.C4[i] >=76){
                    tabel.C4[i] = 4;
                } else if (tabel.C4[i] <= 75 && tabel.C4[i] >=51){
                    tabel.C4[i] = 3;
                } else if (tabel.C4[i] <= 50 && tabel.C4[i] >=26){
                    tabel.C4[i] = 2;
                } else {
                    tabel.C4[i] = 1;
                }

                //C5
                if (tabel.C5[i] <= 125 && tabel.C5[i] >= 101){
                    tabel.C5[i] = 5;
                } else if (tabel.C5[i] <= 100 && tabel.C5[i] >=76){
                    tabel.C5[i] = 4;
                } else if (tabel.C5[i] <= 75 && tabel.C5[i] >=51){
                    tabel.C5[i] = 3;
                } else if (tabel.C5[i] <= 50 && tabel.C5[i] >=26){
                    tabel.C5[i] = 2;
                } else {
                    tabel.C5[i] = 1;
                }
            }

            console.log("\n\n=== DATA PENILAIAN KARYAWAN YANG SUDAH DIKONVERSI ===\n");
            console.log(tabel);

            // NORMALISASI DAN BOBOT BENEFIT
            // Menyiapkan tabel
            const tabel_normalisasi = {
                Nama: Array(),
                C1: Array(),
                C2: Array(),
                C3: Array(),
                C4: Array(),
                C5: Array()
            }

            // Menghitung nilai penyebut
            for (let kolom in tabel) {
                if (kolom == "Nama") {
                    for (let nama of tabel[kolom]) {
                        tabel_normalisasi[kolom].push(nama);
                    }
                    continue;
                }
                
                let penyebut = 0;
                for (let nilai of tabel[kolom]) {
                    penyebut += nilai * nilai;
                }
                penyebut = Math.sqrt(penyebut);

                for (let nilai of tabel[kolom]) {
                    tabel_normalisasi[kolom].push(nilai/penyebut);
                }
            }

            console.log("\n\n=== NORMALISASI DATA PENILAIAN KARYAWAN ===\n");
            console.log(tabel_normalisasi);

            for (let kolom in tabel) {
                if (kolom == "Nama") continue;
                // Mendapatkan bobot benefit
                let bobot = 0;
                switch (kolom) {
                    case 'C1':
                        bobot = 10/100;
                        break;
                    case 'C2':
                        bobot = 15/100;
                        break;
                    case 'C3':
                        bobot = 20/100;
                        break;
                    case 'C4':
                        bobot = 30/100;
                        break;
                    case 'C5':
                        bobot = 25/100;
                        break;
                }

                for (let i = 0; i < tabel_normalisasi[kolom].length; i++) {
                    tabel_normalisasi[kolom][i] *= bobot;
                }
            }
            console.log("\n\n=== DATA PENILAIAN KARYAWAN YANG SUDAH DIKALI DENGAN BOBOT ===\n");
            console.log(tabel_normalisasi);

            // SOLUSI IDEAL POSITIF DAN NEGATIF
            let ideal_positif = {C1: 0, C2: 0, C3: 0, C4: 0, C5: 0}
            let ideal_negatif = {C1: 0, C2: 0, C3: 0, C4: 0, C5: 0}

            for (let kolom in tabel_normalisasi) {
                if (kolom == "Nama") continue;

                ideal_positif[kolom] = Math.max(...tabel_normalisasi[kolom]);
                ideal_negatif[kolom] = Math.min(...tabel_normalisasi[kolom]);
            }

            console.log("\n\n=== SOLUSI IDEAL POSITIF ===\n");
            console.log(ideal_positif);
            console.log("\n\n=== SOLUSI IDEAL NEGATIF===\n");
            console.log(ideal_negatif);

            // MENGHITUNG JARAK SETIAP DATA DENGAN SOLUSI IDEAL
            const jarak_data = {
                Nama: Array(),
                jarak_positif: Array(),
                jarak_negatif: Array()
            }

            for (let i = 0; i < tabel_normalisasi.Nama.length; i++) {
                jarak_data.Nama.push(tabel_normalisasi.Nama[i]);
                
                // Menghitung jarak dengan ideal positif
                let jarak_positif = Math.sqrt(Math.pow(ideal_positif.C1 - tabel_normalisasi.C1[i], 2) + Math.pow(ideal_positif.C2 - tabel_normalisasi.C2[i], 2) + Math.pow(ideal_positif.C3 - tabel_normalisasi.C3[i], 2) + Math.pow(ideal_positif.C4 - tabel_normalisasi.C4[i], 2) + Math.pow(ideal_positif.C5 - tabel_normalisasi.C5[i], 2));
                jarak_data.jarak_positif.push(jarak_positif);

                // Menghitung jarak dengan ideal negatif
                let jarak_negatif = Math.sqrt(Math.pow(ideal_negatif.C1 - tabel_normalisasi.C1[i],2) + Math.pow(ideal_negatif.C2 - tabel_normalisasi.C2[i], 2) + Math.pow(ideal_negatif.C3 - tabel_normalisasi.C3[i], 2) + Math.pow(ideal_negatif.C4 - tabel_normalisasi.C4[i], 2) + Math.pow(ideal_negatif.C5 - tabel_normalisasi.C5[i], 2));
                jarak_data.jarak_negatif.push(jarak_negatif);
            }
            console.log("\n\n=== JARAK SETIAP DATA DENGAN SOLUSI IDEAL===\n\n")
            console.log(jarak_data);

            //MENGHITUNG NILAI PREFERENSI
            let nilai_preferensi = Array();

            for (let i = 0; i < tabel_normalisasi.Nama.length; i++) {
                //PERHITUNGAN NILAI PREFERENSI
                let nama = tabel_normalisasi.Nama[i];
                let nilai = jarak_data.jarak_negatif[i] / (jarak_data.jarak_positif[i] + jarak_data.jarak_negatif[i]);

                nilai_preferensi.push([nama, nilai]);
            }
            console.log("\n\n=== NILAI PREFERENSI DARI SETIAP DATA===\n\n")
            console.log(nilai_preferensi);


            // MENGURUTKAN NILAI PREFERENSI DARI YANG TERBESAR
            nilai_preferensi.sort((a, b) => {
                return (a[1] - b[1]) * -1;
            })

            console.log("\n\n=== NILAI PREFERENSI DIURUTKAN DARI TERBESAR===\n\n");
            console.log(nilai_preferensi);
        })
    })
    db.close()
}

module.exports = count