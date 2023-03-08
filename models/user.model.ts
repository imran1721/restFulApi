import { Model, Table, Column, AllowNull, AutoIncrement, PrimaryKey, NotEmpty, DataType, Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
// export interface UserI {
//   id?: number | null;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phone?: string;
// }

@Table({ tableName: 'users', timestamps: true })
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: uuidv4()
  })
  id?: number | null;

  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName?: string;

  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName?: string;

  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email?: string;

  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone?: string;
}
