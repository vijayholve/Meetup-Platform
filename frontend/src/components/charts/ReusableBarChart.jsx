import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const ReusableBarChart = ({
  title,
  subtitle,
  series = [],
  xAxisCategories = [],
  height = 480,
  showCard = true,
  chartId = 'reusable-bar-chart',
  ...otherChartOptions
}) => {
  const theme = useTheme();
  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;

  // Chart options
  const options = {
    chart: {
      id: chartId,
      type: 'bar', // Ensures the chart is a bar chart
      height: height,
      toolbar: {
        show: true
      },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    // The stroke property is removed to prevent conflicts with bar rendering
    xaxis: {
      categories: xAxisCategories,
      labels: {
        style: {
          colors: primary
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: primary
        }
      }
    },
    grid: {
      borderColor: divider
    },
    tooltip: {
      theme: theme.palette.mode
    },
    ...otherChartOptions
  };

  const ChartContent = () => (
    <Grid container spacing={gridSpacing}>
      {(title || subtitle) && (
        <Grid item xs={12}>
          <Grid container direction="column" spacing={1}>
            {subtitle && (
              <Grid item>
                <Typography variant="subtitle2">{subtitle}</Typography>
              </Grid>
            )}
            {title && (
              <Grid item>
                <Typography variant="h3">{title}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        sx={{
          '& .apexcharts-menu.apexcharts-menu-open': {
            bgcolor: 'background.paper'
          }
        }}
      >
        <Chart options={options} series={series} type="bar" height={height} />
      </Grid>
    </Grid>
  );

  return showCard ? (
    <MainCard>
      <ChartContent />
    </MainCard>
  ) : (
    <ChartContent />
  );
};

ReusableBarChart.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.array.isRequired
    })
  ).isRequired,
  xAxisCategories: PropTypes.array,
  height: PropTypes.number,
  showCard: PropTypes.bool,
  chartId: PropTypes.string
};

export default ReusableBarChart;