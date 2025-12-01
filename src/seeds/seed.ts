import ds from '../../ormconfig';
import { Permission } from '../modules/permissions/permission.entity';
import { User } from '../modules/users/user.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
    const dataSource = await ds.initialize();

    const repoPerm = dataSource.getRepository(Permission);
    const permissionsData = [
        { name: 'admin', description: 'Administra usuários e artigos' },
        { name: 'editor', description: 'Administra artigos' },
        { name: 'reader', description: 'Apenas leitura' },
    ];

    for (const p of permissionsData) {
        const exists = await repoPerm.findOne({ where: { name: p.name } });
        if (!exists) await repoPerm.save(p);
    }

    const repoUser = dataSource.getRepository(User);

    const email = process.env.ROOT_EMAIL!;
    const pass = await bcrypt.hash(process.env.ROOT_PASS!, 10);

    const adminPermission = await repoPerm.findOne({ where: { name: 'admin' } });

    if (!adminPermission) {
        throw new Error('Permissão admin não encontrada. A seed não foi carregada corretamente.');
    }


    const existsUser = await repoUser.findOne({ where: { email } });

    if (!existsUser) {
        await repoUser.save({
            name: 'Root',
            email,
            password: pass,
            permission: { id: adminPermission.id },
        });
    }

    console.log('Seed finalizado!');
    await dataSource.destroy();
}

seed();
