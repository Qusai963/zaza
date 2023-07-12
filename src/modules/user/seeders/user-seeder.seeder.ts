// import { Injectable } from '@nestjs/common';
// import { Seeder } from 'typeorm-seeding';
// import dataSource from 'db/data-source';
// import { User } from '../entities/user.entity';

// @Injectable()
// export class UserSeeder implements Seeder {
//   async run(): Promise<void> {
//     const userData = [
//       {
//         userName: 'john_doe',
//         name: 'John Doe',
//         password: 'password1',
//         email: 'john@example.com',
//       },
//       {
//         userName: 'jane_smith',
//         name: 'Jane Smith',
//         password: 'password2',
//         email: 'jane@example.com',
//       },
//       // Add more user objects as needed
//     ];

//     const userRepository = dataSource.getRepository(User);

//     for (const userObj of userData) {
//       const user = userRepository.create(userObj);
//       await userRepository.save(user);
//     }
//   }
// }
