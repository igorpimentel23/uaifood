import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateRestaurants1613428820801
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'restaurants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'lat',
            type: 'float',
          },
          {
            name: 'lng',
            type: 'float',
          },
          {
            name: 'rating',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'cost',
            type: 'decimal',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'restaurants',
      new TableForeignKey({
        name: 'RestaurantUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('restaurants', 'RestaurantUser');
    await queryRunner.dropTable('restaurants');
  }
}
