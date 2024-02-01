import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    Index
} from 'typeorm';

@Entity('user')
@Unique(['email'])
@Index('index_email')
export class User {

    @PrimaryGeneratedColumn({
        name: 'user_id',
        type: 'int'
    })
    userId!: number;

    @Column({
        name: 'email',
        type: 'varchar',
        length: 128
    })
    email!: string;

    @Column({
        name: 'password', 
        type: 'varchar', 
        length: 128
    })
    password!: string;

    @Column({
        name: 'last_name', 
        type: 'varchar', 
        length: 50
    })
    lastName!: string;

    @Column({
        name: 'first_name', 
        type: 'varchar', 
        length: 50
    })
    firstName!: string;

    @Column({
        name: 'profile_image',
        type: 'varchar',
        length: 128,
        default: 'default_image.jpg'
    })
    profileImage!: string;

    @Column({
        name: 'refresh_token',
        type: 'varchar',
        length: 255,
        nullable: true
    })
    refreshToken?: string | null;
}