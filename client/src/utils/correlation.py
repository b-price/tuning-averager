import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

# Extracting the data from the provided text
string_gauges = np.array([40,
44,
56,
60,
76,
80,
101,
106,
126,
130])
unit_weights = np.array([0.00037608,
0.00041369,
0.00066571,
0.00071326,
0.00120125,
0.00126442,
0.00210063,
0.00220462,
0.00262059,
0.00270378])

# Trying to fit a power law (y = a * x^b) for correlation
def power_law(x, a, b):
    return a * x**b

params, covariance = curve_fit(power_law, string_gauges, unit_weights)

# Plotting the data and the fitted curve
plt.figure(figsize=(10, 6))
plt.scatter(string_gauges, unit_weights, color='blue', label='Data')
plt.plot(string_gauges, power_law(string_gauges, *params), color='red', label=f'Fit: y = {params[0]:.6e} * x^{params[1]:.2f}')
plt.xlabel('String Gauges')
plt.ylabel('Unit Weights')
plt.title('Correlation between String Gauges and Unit Weights')
plt.legend()
plt.grid(True)
plt.show()

print(params)  # Returning the parameters of the fitted model
