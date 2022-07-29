## How To Run :
**Pastikan environment yang digunakan untuk menjalankan program sudah terinstall node js,npm,dan postgreSQL**
1. npm install
2. sequelize run db:create
3. sequelize run db:migrate
4. sequelize run db:seed --seed "20220615155237-add-masterdata-to-cities.js"
5. sequelize run db:seed --seed "20220625142012-add seed category.js"
6. sequelize run db:seed --seed "20220713034832-notification_types_seeder.js"
7. npm start

## How To Run Integration Test :
1. npm run setUpTesting
2. npm run test

**ERD DESIGN :**
[Link To ERD Design](https://drive.google.com/file/d/1KjkHU-RjvBpybZO064R8QuSqCYagfnsU/view?usp=sharing)

**API Documentation**
[Link To API Documentation](https://documenter.getpostman.com/view/21464192/UzBjrnes)
