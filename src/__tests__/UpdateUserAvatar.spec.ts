import 'reflect-metadata';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import RequestError from '@shared/exceptions/RequestError';
import FakeUsersRepository from './repositories/FakeUsersRepository';
import FakeStorageProvider from './providers/FakeStorageProviders';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageRepository: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;
describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageRepository = new FakeStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageRepository,
        );
    });
    it("should be able to create a User's avatar", async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@email.com',
            name: 'John Doe',
            password: 'secret',
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });
        expect(user.avatar).toBe('avatar.jpg');
    });
    it('should not be able to update avatar of non existing User', async () => {
        await expect(
            updateUserAvatarService.execute({
                user_id: '1827381237214823',
                avatarFilename: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(RequestError);
    });
    it("should be able to update a User's avatar", async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@email.com',
            name: 'John Doe',
            password: 'secret',
        });

        // creating the avatar for a user
        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });
        // actually trying to update the same user's avatar
        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        expect(user.avatar).toBe('avatar2.jpg');
    });
});
