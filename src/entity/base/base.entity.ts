import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}