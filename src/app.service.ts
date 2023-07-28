import { Injectable } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { AuthService } from './modules/auth/auth.service';
import { LanguageService } from './modules/language/language.service';
@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly languageService: LanguageService,
  ) {}

  async seed() {
    const user = await this.userService.findByUserName('admin');
    if (!user)
      this.userService.create({
        userName: 'admin',
        email: 'admin@gmail.com',
        password: await this.authService.hashPassword('12345678'),
        name: 'zaza',
      });

    const en = await this.languageService.findByCode('en');
    if (!en) this.languageService.create({ code: 'en', name: 'English' });

    const de = await this.languageService.findByCode('de');
    if (!de) this.languageService.create({ code: 'de', name: 'German' });

    const ar = await this.languageService.findByCode('ar');
    if (!ar) this.languageService.create({ code: 'ar', name: 'Arabic' });
  }
}
