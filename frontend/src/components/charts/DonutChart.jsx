import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const ReusableDonutChart = ({
  title,
  subtitle,
  series = [],
  labels = [],
  height = 300,
  showCard = true,
  chartId = 'reusable-donut-chart',
  colors,
  ...otherChartOptions
}) => {
  const theme = useTheme();
  const { primary } = theme.palette.text;

  const defaultColors = colors || [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main
  ];

  const options = {
    chart: {
      id: chartId,
      background: 'transparent'
    },
    labels: labels,
    legend: {
      position: 'bottom',
      labels: {
        colors: primary
      }
    },
    colors: defaultColors,
    dataLabels: {
      enabled: true
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
      <Grid item xs={12}>
        {/* === THE FIX IS HERE === */}
        {/* We now pass type and height as explicit props for reliability */}
        <Chart options={options} series={series} type="donut" height={height} />
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

ReusableDonutChart.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  series: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  height: PropTypes.number,
  showCard: PropTypes.bool,
  chartId: PropTypes.string,
  colors: PropTypes.array
};

export default ReusableDonutChart;