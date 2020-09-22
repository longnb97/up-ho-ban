import { SocialNetworks } from './social-networks.model';

export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    
    avatar: string = './assets/media/users/default.jpg';
    fullName: string;
	phone: string;
    socialNetworks: SocialNetworks;


    clear(): void {
        this.id = undefined;
        this.username = '';
        this.password = '';
        this.email = '';
        this.fullName = '';
        this.accessToken = 'access-token-' + Math.random();
        this.refreshToken = 'access-token-' + Math.random();
        this.avatar = './assets/media/users/default.jpg';
        this.phone = '';
        this.socialNetworks = new SocialNetworks();
        this.socialNetworks.clear();
    }
}
