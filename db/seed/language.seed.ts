// import dataSource from 'db/data-source';
// import { Language } from 'src/modules/language/entities/language.entity';

// const languagesSeedData = [
//   { code: 'ar', name: 'Arabic' },
//   { code: 'en', name: 'English' },
//   { code: 'de', name: 'Germany' },
// ];

// export const seedLanguages = async () => {
//   for (const languageData of languagesSeedData) {
//     const existingLanguage = await dataSource.getRepository(Language).findOne({
//       where: { code: languageData.code },
//     });

//     if (!existingLanguage) {
//       const language = new Language();
//       language.code = languageData.code;
//       language.name = languageData.name;
//       await dataSource.getRepository(Language).save(language);
//     }
//   }
// };
