import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Item from '@modules/items/infra/typeorm/entities/Item';

@Entity('restaurants')
class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  street: string;

  @Column()
  street_number: number;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  geolocation: string;

  @Column()
  rating: number;

  @Column()
  cost: number;

  @Column()
  type: string;

  @OneToMany(() => Item, item => item.restaurant)
  items: Item[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Restaurant;
