** Urutan wajib melakukan testing (tidak bisa secara bersamaan karena deleteMany diawal testing) lalu jalankan perintah:
1.  yarn test users.spec.js
2.  yarn test account.spec.js
3.  yarn test transactions.spec.js
4.  auth


** Jika ingin melakukan testing API Delete (user, account, transaction)
1. Delete/kosongkan semua data yang ada pada database (user, profile, account, transaction) melalui request.http
2. Buat masing-masing 1 data melalui request.http (user, account, transaction) // sesuaikan idnya
3. Matikan/komen deleteMany pada beforeAll di testing users.spec.js
4. Nyalakan semua perintah API Delete pada file testing lalu jalankan perintah
5.  yarn test users.spec.js
6.  yarn test account.spec.js
7.  yarn test transactions.spec.js