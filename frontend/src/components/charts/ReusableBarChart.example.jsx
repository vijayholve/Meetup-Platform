import React from 'react';
import ReusableBarChart from './ReusableBarChart';

// ==============================|| REUSABLE BAR CHART USAGE EXAMPLES ||============================== //

const ReusableBarChartExamples = () => {
  // Example 1: Simple Bar Chart
  const simpleSeries = [
    {
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }
  ];

  const simpleCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  // Example 2: Multiple Series Bar Chart
  const multipleSeries = [
    {
      name: 'Students',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    },
    {
      name: 'Teachers',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }
  ];

  const multipleCategories = ['Class A', 'Class B', 'Class C', 'Class D', 'Class E', 'Class F', 'Class G', 'Class H', 'Class I'];

  // Example 3: Student Performance Chart
  const performanceSeries = [
    {
      name: 'Math Scores',
      data: [85, 92, 78, 96, 87, 94, 88, 91, 89]
    },
    {
      name: 'Science Scores',
      data: [90, 88, 82, 94, 91, 89, 93, 87, 92]
    }
  ];

  const studentCategories = ['Student A', 'Student B', 'Student C', 'Student D', 'Student E', 'Student F', 'Student G', 'Student H', 'Student I'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reusable Bar Chart Examples</h2>
      
      {/* Example 1: Simple Bar Chart */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 1: Simple Bar Chart</h3>
        <ReusableBarChart
          title="Monthly Sales"
          subtitle="Sales Performance"
          series={simpleSeries}
          xAxisCategories={simpleCategories}
          xAxisTitle="Months"
          yAxisTitle="Sales Amount"
          height={400}
          chartId="simple-bar-chart"
        />
      </div>

      {/* Example 2: Multiple Series */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 2: Multiple Series Bar Chart</h3>
        <ReusableBarChart
          title="Class Statistics"
          subtitle="Students and Teachers Count"
          series={multipleSeries}
          xAxisCategories={multipleCategories}
          xAxisTitle="Classes"
          yAxisTitle="Count"
          height={450}
          chartId="multiple-series-chart"
          dataLabels={{ enabled: true }}
        />
      </div>

      {/* Example 3: Without Card Wrapper */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 3: Without Card Wrapper</h3>
        <ReusableBarChart
          title="Student Performance"
          subtitle="Test Scores Comparison"
          series={performanceSeries}
          xAxisCategories={studentCategories}
          xAxisTitle="Students"
          yAxisTitle="Scores"
          height={400}
          showCard={false}
          chartId="performance-chart"
          plotOptions={{
            bar: {
              horizontal: false,
              columnWidth: '65%',
              endingShape: 'rounded'
            }
          }}
        />
      </div>

      {/* Example 4: Horizontal Bar Chart */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 4: Horizontal Bar Chart</h3>
        <ReusableBarChart
          title="Department Performance"
          subtitle="Monthly Targets"
          series={[
            {
              name: 'Target Achievement',
              data: [320, 302, 301, 334, 390, 330, 320]
            }
          ]}
          xAxisCategories={['Math', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry']}
          xAxisTitle="Achievement %"
          yAxisTitle="Departments"
          height={400}
          chartId="horizontal-chart"
          plotOptions={{
            bar: {
              horizontal: true
            }
          }}
        />
      </div>
    </div>
  );
};

export default ReusableBarChartExamples; 