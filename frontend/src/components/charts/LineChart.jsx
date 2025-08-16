import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const ReusableLineChart = ({
  title,
  subtitle,
  series = [],
  xAxisCategories = [],
  xAxisTitle = '',
  yAxisTitle = '',
  height = 480,
  showCard = true,
  chartId = 'reusable-line-chart',
  colors,
  dataLabels = { enabled: false },
  stroke = { curve: 'smooth', width: 2 },
  ...otherChartOptions
}) => {
  const theme = useTheme();
  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;

  const defaultColors = colors || [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main
  ];

  const defaultChartOptions = {
    chart: {
      id: chartId,
      type: 'line',
      height: height,
      toolbar: {
        show: true
      },
      background: 'transparent'
    },
    dataLabels: dataLabels,
    stroke: stroke,
    xaxis: {
      categories: xAxisCategories,
      title: {
        text: xAxisTitle,
        style: {
          color: primary
        }
      },
      labels: {
        style: {
          colors: primary
        }
      },
      axisBorder: {
        show: true,
        color: divider
      },
      axisTicks: {
        show: true,
        color: divider
      }
    },
    yaxis: {
      title: {
        text: yAxisTitle,
        style: {
          color: primary
        }
      },
      labels: {
        style: {
          colors: primary
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: function (val) {
          return val.toString();
        }
      }
    },
    legend: {
      labels: {
        colors: primary
      }
    },
    grid: {
      borderColor: divider,
      strokeDashArray: 0,
    },
    colors: defaultColors,
    ...otherChartOptions
  };

  const chartConfig = {
    options: defaultChartOptions,
    series: series
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
        <Chart {...chartConfig} />
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

ReusableLineChart.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.array.isRequired
    })
  ).isRequired,
  xAxisCategories: PropTypes.array,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  height: PropTypes.number,
  showCard: PropTypes.bool,
  chartId: PropTypes.string,
  colors: PropTypes.array,
  dataLabels: PropTypes.object,
  stroke: PropTypes.object
};

export default ReusableLineChart;