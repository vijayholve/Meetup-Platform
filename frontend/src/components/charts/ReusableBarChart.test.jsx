import React from 'react';
import ReusableBarChart from './ReusableBarChart';
import CustomLineChart from 'ui-component/charts/LineChart';
import CustomBarChart from 'ui-component/charts/BarChart';
import CustomDonutChart from 'ui-component/charts/DonutChart';
import SimpleList from 'ui-component/charts/SimpleList';

// ==============================|| SIMPLE BAR CHART TEST ||============================== //

const SimpleBarChartTest = () => {
  // Simple test data
  const series = [
    {
      name: 'Students',
      data: [23, 45, 32, 67, 49, 58, 41]
    }
  ];

  const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Multiple series test
  const multiSeries = [
    {
      name: 'Boys',
      data: [23, 45, 32, 67, 49]
    },
    {
      name: 'Girls',
      data: [34, 52, 41, 58, 62]
    }
  ];

  const multiCategories = ['Class A', 'Class B', 'Class C', 'Class D', 'Class E'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Bar Chart Visibility Test</h2>

      {/* Test 1: Simple single series */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Test 1: Single Series Chart</h3>
        <ReusableBarChart
          title="Weekly Students"
          subtitle="Daily Attendance"
          series={series}
          xAxisCategories={categories}
          xAxisTitle="Days"
          yAxisTitle="Number of Students"
          height={350}
          chartId="test-single-chart"
        />
      </div>

      {/* Test 2: Multiple series */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Test 2: Multiple Series Chart</h3>
        <ReusableBarChart
          title="Student Distribution"
          subtitle="Boys vs Girls"
          series={multiSeries}
          xAxisCategories={multiCategories}
          xAxisTitle="Classes"
          yAxisTitle="Count"
          height={350}
          chartId="test-multi-chart"
          dataLabels={{ enabled: true }}
        />
      </div>

      {/* Test 3: Without card wrapper */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Test 3: Without Card Wrapper</h3>
        <ReusableBarChart
          series={[{ name: 'Values', data: [10, 25, 15, 40, 30] }]}
          xAxisCategories={['A', 'B', 'C', 'D', 'E']}
          xAxisTitle="Categories"
          yAxisTitle="Values"
          showCard={false}
          height={300}
          chartId="test-no-card"
        />
      </div>

      {/* Test 4: Custom colors */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Test 4: Custom Colors</h3>
        <ReusableBarChart
          title="Custom Colored Chart"
          series={[{ name: 'Data', data: [15, 25, 35, 45, 55] }]}
          xAxisCategories={['Q1', 'Q2', 'Q3', 'Q4', 'Q5']}
          colors={['#FF6B6B']}
          height={300}
          chartId="test-custom-colors"
        />
      </div>
    </div>
  );
};

export default SimpleBarChartTest;
