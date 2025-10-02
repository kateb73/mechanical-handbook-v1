import pandas as pd

filename = r"c:\Users\KateBrenner\mechanical-handbook\test.csv"

df = pd.read_csv(filename, index_col = 0)

value = df.loc["0.25","1.5"]

print(value)