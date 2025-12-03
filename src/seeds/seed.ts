import ds from '../datasource';
import { Permission } from '../modules/permissions/permission.entity';
import { User } from '../modules/users/user.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
    const dataSource = await ds.initialize();

    const permRepo = dataSource.getRepository(Permission);
    const userRepo = dataSource.getRepository(User);

    const roles = [
        { name: 'admin', description: 'Administra usuários e artigos' },
        { name: 'editor', description: 'Administra artigos' },
        { name: 'reader', description: 'Apenas leitura' },
    ];

    for (const r of roles) {
        const exists = await permRepo.findOne({ where: { name: r.name } });
        if (!exists) await permRepo.save(permRepo.create(r));
    }

    const rootEmail = process.env.ROOT_EMAIL || 'root@example.com';
    const rootPass = process.env.ROOT_PASS || '123456';

    const adminPerm = await permRepo.findOne({ where: { name: 'admin' } });
    if (!adminPerm) throw new Error('Permissão admin não encontrada no seed');

    const existingRoot = await userRepo.findOne({ where: { email: rootEmail } });
    if (!existingRoot) {
        const hashed = await bcrypt.hash(rootPass, 10);
        const root = userRepo.create({
            name: 'Root',
            email: rootEmail,
            password: hashed,
            permission: { id: adminPerm.id },
        } as any);
        await userRepo.save(root);
        console.log('Root user created:', rootEmail);
    } else {
        console.log('Root user already exists:', rootEmail);
    }

    await dataSource.destroy();
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
