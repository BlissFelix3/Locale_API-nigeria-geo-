import { Injectable } from '@nestjs/common';
import { ApiKeyService } from './key';
import { LoginDto } from './dto';
import { SignupDto } from './dto';
import { ApiKey } from './key';

@Injectable()
export class AuthService {
  constructor(
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async validateUser(email: string, password: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyService.findApiKeyByEmail(email);
    if (apiKey && (await this.apiKeyService.comparePassword(apiKey, password))) {
      return apiKey;
    }
    return null;
  }

  async signup(signupDto: SignupDto): Promise<ApiKey> {
    const apiKey = await this.apiKeyService.createApiKey(signupDto);
    return apiKey;
  }

  async login(loginDto: LoginDto): Promise<ApiKey> {
    const apiKey = await this.validateUser(loginDto.email, loginDto.password);
    if (!apiKey) {
      return null;
    }
    return apiKey;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    return this.apiKeyService.validateApiKey(apiKey);
  }
}
