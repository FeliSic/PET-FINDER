import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db";

// ============================================
// USER MODEL
// ============================================
interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  name?: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  }
}

class User extends Model<UserAttributes> {
  declare id: number;
  declare email: string;
  declare password: string;
  declare name: string | null;
  declare location: {
    name: string;
    lat: number;
    lng: number;
  }
  
  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
  type: DataTypes.JSON,
  allowNull: true,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
});

// ============================================
// AUTH MODEL
// ============================================
class Auth extends Model {
  declare id: number;
  declare token: string;
  declare UserId: number | null;
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Auth.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: "Auth",
  tableName: 'Auths',
});

User.hasOne(Auth);
Auth.belongsTo(User);

// ============================================
// PET MODEL
// ============================================
interface PetAttributes {
  id?: number;
  nombre: string;
  bio: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  }
  status?: string;
  img: string;
  userId: number;
}

class Pet extends Model<PetAttributes> {
  declare id: number;
  declare nombre: string;
  declare bio: string;
  declare location: {
    name: string;
    lat: number;
    lng: number;
  }
  declare status: string;
  declare img: string;
  declare userId: number;
  
  // Relación con User
  declare User?: User;
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Pet.init({
  id: { 
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  location: {
  type: DataTypes.JSON,
  allowNull: false,
  validate: {
    notEmpty: true,
  },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "lost",
    validate: {
      isIn: [['lost', 'found']],
    },
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
  },
}, {
  sequelize,
  modelName: "Pet",
  tableName: 'Pets',
});

User.hasMany(Pet, { as: 'Pets', foreignKey: 'userId' });
Pet.belongsTo(User, { foreignKey: 'userId' });

// ============================================
// REPORT MODEL
// ============================================
interface ReportAttributes {
  id?: number;
  reporterName: string;
  reporterPhone: string;
  location: string;
  message?: string;
  petId: number;
  ownerId: number;
}

class Report extends Model<ReportAttributes> {
  declare id: number;
  declare reporterName: string;
  declare reporterPhone: string;
  declare location: string;
  declare message: string | null;
  declare petId: number;
  declare ownerId: number;
  
  // Relaciones
  declare Pet?: Pet;
  declare Owner?: User;
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Report.init({
  id: { 
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reporterName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  reporterPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pets',
      key: 'id',
    },
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: "Report",
  tableName: 'Reports',
  timestamps: true,
});

// Relaciones de Report
Pet.hasMany(Report, { foreignKey: 'petId', as: 'Reports' });
Report.belongsTo(Pet, { foreignKey: 'petId' });

User.hasMany(Report, { foreignKey: 'ownerId', as: 'ReceivedReports' });
Report.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });

export { User, Auth, Pet, Report };