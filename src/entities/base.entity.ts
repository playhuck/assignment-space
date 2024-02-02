import { DeleteDateColumn, Column } from 'typeorm';

export class CustomBaseEntity {
    @Column({
        name: 'created_at',
        type: 'varchar'
    })
    createdAt!: string;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true
    })
    deletedAt?: Date | null;
}