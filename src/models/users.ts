import { D1Orm, DataTypes, Infer, Model } from "d1-orm";
const Orm = new D1Orm(env.DB);

const users = new Model(
	{
		D1Orm: Orm,
		tableName: 'users',
		primaryKeys: 'id',
		autoIncrement: 'id'
	},
	{
		   id: {type: DataTypes.INTEGER},
			name: {type: DataTypes.TEXT},
			marks: {type: DataTypes.TEXT},
			email: {type: DataTypes.TEXT},
			password: {type: DataTypes.TEXT},
			status: {type: DataTypes.NUMBER},
			createdAt: {type: DataTypes.STRING},
			phoneNumer: {type: DataTypes.NUMBER}	
	}
)

export default users;

