import pandas as pd
import numpy as np
import nbformat as nbf
import json
import os
from datetime import datetime, timedelta

def main():
    base_path = 'f:/USB/Placement dost/Power Bi/PowerBi/PBI employee survey'
    excel_path = os.path.join(base_path, 'HR Employee Survey Responses.xlsx')
    
    print("Loading data...")
    df = pd.read_excel(excel_path, sheet_name='HR Survey Reponses')
    
    # Generate mock dates
    print("Generating mock dates...")
    np.random.seed(42)
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2023, 6, 30)
    delta = end_date - start_date
    random_days = np.random.randint(0, delta.days, len(df))
    df['Date'] = [start_date + timedelta(days=int(d)) for d in random_days]
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
    
    # Determine the actual Role
    def get_role(row):
        if row['Director'] == 1: return 'Director'
        if row['Manager'] == 1: return 'Manager'
        if row['Supervisor'] == 1: return 'Supervisor'
        if row['Staff'] == 1: return 'Staff'
        return 'Unknown'
    
    df['Role'] = df.apply(get_role, axis=1)
    
    # Save Data for React Dashboard
    print("Exporting JSON for dashboard...")
    json_path = os.path.join(base_path, 'dashboard_data.json')
    # Replace NaN with None so it's valid JSON (null)
    df_json = df.replace({np.nan: None})
    records = df_json.to_dict(orient='records')
    with open(json_path, 'w') as f:
        json.dump(records, f)
        
    print("Generating Jupyter Notebook...")
    nb = nbf.v4.new_notebook()
    
    cells = []
    
    cells.append(nbf.v4.new_markdown_cell("# HR Employee Survey Data Analysis\n\nThis notebook performs data analysis on the HR Employee Survey Responses dataset. We will explore the data, clean it, and create visualizations to understand survey results across departments and roles."))
    
    code1 = """import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_theme(style="whitegrid")

# Load dataset
df = pd.read_excel('HR Employee Survey Responses.xlsx', sheet_name='HR Survey Reponses')
df.head()"""
    cells.append(nbf.v4.new_code_cell(code1))
    
    cells.append(nbf.v4.new_markdown_cell("## 1. Data Cleaning and Transformation\n\nWe observe that roles are one-hot encoded. Let's unpivot them into a single `Role` column for easier grouping. We also check for missing responses."))
    
    code2 = """# Handle missing values
missing_count = df['Response'].isna().sum()
print(f"Number of incomplete responses (missing response value): {missing_count}")

# Unpivot roles
def get_role(row):
    if row['Director'] == 1: return 'Director'
    if row['Manager'] == 1: return 'Manager'
    if row['Supervisor'] == 1: return 'Supervisor'
    if row['Staff'] == 1: return 'Staff'
    return 'Unknown'

df['Role'] = df.apply(get_role, axis=1)

# Drop original one-hot columns if desired, but we can keep them.
df[['Department', 'Role', 'Question', 'Response', 'Response Text']].head()"""
    cells.append(nbf.v4.new_code_cell(code2))
    
    cells.append(nbf.v4.new_markdown_cell("## 2. Calculated Metrics (DAX Equivalents)\n\nWe calculate the average survey response by department and role."))
    
    code3 = """# Average response by Department
dept_avg = df.groupby('Department')['Response'].mean().reset_index().sort_values(by='Response', ascending=False)
print("Average Response by Department:")
print(dept_avg)

print("\\n")
# Average response by Role
role_avg = df.groupby('Role')['Response'].mean().reset_index().sort_values(by='Response', ascending=False)
print("Average Response by Role:")
print(role_avg)"""
    cells.append(nbf.v4.new_code_cell(code3))
    
    cells.append(nbf.v4.new_markdown_cell("## 3. Role Distribution Analysis\n\nLet's visualize the distribution of roles within the company."))
    
    code4 = """plt.figure(figsize=(8, 8))
role_counts = df['Role'].value_counts()
plt.pie(role_counts, labels=role_counts.index, autopct='%1.1f%%', startangle=140, colors=sns.color_palette("pastel"))
plt.title('Role Distribution Across the Company')
plt.show()"""
    cells.append(nbf.v4.new_code_cell(code4))
    
    cells.append(nbf.v4.new_markdown_cell("## 4. Department-wise Survey Analysis\n\nVisualizing the average survey response for each department."))
    
    code5 = """plt.figure(figsize=(12, 6))
sns.barplot(x='Response', y='Department', data=dept_avg, palette='viridis')
plt.title('Average Survey Response by Department')
plt.xlabel('Average Response (0-4)')
plt.ylabel('Department')
plt.show()"""
    cells.append(nbf.v4.new_code_cell(code5))
    
    cells.append(nbf.v4.new_markdown_cell("## 5. Comparative Analysis\n\nComparing average survey responses across different roles within each department."))
    
    code6 = """plt.figure(figsize=(14, 8))
sns.barplot(x='Department', y='Response', hue='Role', data=df, errorbar=None, palette='Set2')
plt.title('Average Survey Response by Role and Department')
plt.xlabel('Department')
plt.ylabel('Average Response')
plt.xticks(rotation=45, ha='right')
plt.legend(title='Role', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()"""
    cells.append(nbf.v4.new_code_cell(code6))
    
    nb['cells'] = cells
    
    nb_path = os.path.join(base_path, 'HR_Survey_Analysis.ipynb')
    with open(nb_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
        
    print(f"Jupyter Notebook successfully created at: {nb_path}")

if __name__ == "__main__":
    main()
