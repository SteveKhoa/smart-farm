import pandas as pd
from sqlalchemy import create_engine, text
from sklearn.linear_model import LinearRegression

class DataAgent:
    def __init__(self, db_url):
        self.engine = create_engine(db_url)


        try:
            if not table_name:
                raise ValueError("Table name is required.")
            query = f"SELECT * FROM {schema}.{table_name}"
            df = pd.read_sql(query, self.engine)
            print(f"Data read successfully from {schema}.{table_name}.")
            return df
        except Exception as e:
            print(f"[ERROR] {e}")
            return None
            if not self.isExisted(schema=schema, table_name=table_name):
                df.to_sql(name=table_name, con=self.engine, schema=schema, if_exists='replace', index=False, method=method)
                print(f"Table {schema}.{table_name} created successfully.")
            else:
                df.to_sql(name=table_name, con=self.engine, schema=schema, if_exists='append', index=False, method=method)
                print(f"Data appended to {schema}.{table_name} successfully using method: {method}")
            with self.engine.connect() as conn:
            if method == 'overwrite':
                self.overwrite_table(df, table_name, schema, conn)
            elif method == 'update':
                key_columns = df.columns[:1].tolist()
                self.update_table(df, table_name, schema, key_columns, conn)
            elif method == 'upsert':                                            
                key_columns = df.columns[:1].tolist()
                self.upsert_table(df, table_name, schema, key_columns, conn)
            else:
                df.to_sql(name=table_name, con=conn, schema=schema, if_exists='append', index=False, method=method)
                print(f"Data appended to {schema}.{table_name} successfully using method: {method}")
            if method in ['overwrite', 'update', 'upsert']:
                print(f"Data written successfully using method: {method}")
            else:
                df.to_sql(name=table_name, con=conn, schema=schema, if_exists='append', index=False, method=method)
                print(f"Data appended to {schema}.{table_name} successfully using method: {method}")
            if method == 'overwrite':
                self.overwrite_table(df, table_name, schema, conn)
            elif method == 'update':
                key_columns = df.columns[:1].tolist()
                self.update_table(df, table_name, schema, key_columns, conn)
            elif method == 'upsert':
                key_columns = df.columns[:1].tolist()
                self.upsert_table(df, table_name, schema, key_columns, conn)
            else:           
                df.to_sql(name=table_name, con=conn, schema=schema, if_exists='append', index=False, method=method)
                print(f"Data appended to {schema}.{table_name} successfully using method: {method}")
            if method in ['overwrite', 'update', 'upsert']:

                print(f"Data written successfully using method: {method}")
            else:
                df.to_sql(name=table_name, con=conn, schema=schema, if_exists='append', index=False, method=method)
                print(f"Data appended to {schema}.{table_name} successfully using method: {method}")
            if method == 'overwrite':
                self.overwrite_table(df, table_name, schema, conn)
            elif method == 'update':
                key_columns = df.columns[:1].tolist()
                self.update_table(df, table_name, schema, key_columns, conn)
            elif method == 'upsert':
                key_columns = df.columns[:1].tolist()
                self.upsert_table(df, table_name, schema, key_columns, conn)
            else:
                df.to_sql(name=table_name, con=conn, schema=schema, if_exists='append', index=False, method=method)
                print(f"Data appended to {schema}.{table_name} successfully using method: {method}")
            if method in ['overwrite', 'update', 'upsert']:
                print(f"Data written successfully using method: {method}")
            else:
                df.to_sql(name=table_name, con=conn, schema=schema, if_exists='append', index=False, method=method)
                print(f"Data appended to {schema}.{table_name} successfully using method: {method}")
    def predict_missing_value(self, table_name, schema='public'):
        try:
            if not table_name:
                raise ValueError("Table name is required.")
            query = f"SELECT * FROM {schema}.{table_name} ORDER BY timestamp DESC LIMIT 3"
            df = pd.read_sql(query, self.engine)
            if df.empty:
                print(f"No data found in {schema}.{table_name}.")
                return None
            
            # Assuming the last column is the target variable
            target_col = df.columns[-1]
            X = df.iloc[:, :-1]  # Features
            y = df[target_col]   # Target variable
            
            
            model = LinearRegression()
            model.fit(X, y)
            
            # Predict the missing value
            missing_value = model.predict([X.iloc[-1]])[0]
            print(f"Predicted missing value: {missing_value}")
            return missing_value
        except Exception as e:
            print(f"[ERROR] {e}")
            return None