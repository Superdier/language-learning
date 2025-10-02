import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { CHART_COLORS } from '../../utils/constants';
import { getStudyStatistics } from '../../utils/helpers';
import '../../utils/chartConfig';

const ProgressChart = ({ reviewHistory, viewMode = 'week' }) => {
  const days = viewMode === 'week' ? 7 : 30;

  const chartData = useMemo(() => {
    const stats = getStudyStatistics(reviewHistory, days);
    const labels = [];
    const grammarData = [];
    const vocabularyData = [];
    const kanjiData = [];
    const readingData = [];
    const listeningData = [];

    Object.keys(stats).forEach(dateKey => {
      const date = new Date(dateKey);
      labels.push(format(date, 'dd/MM'));
      grammarData.push(stats[dateKey].grammar || 0);
      vocabularyData.push(stats[dateKey].vocabulary || 0);
      kanjiData.push(stats[dateKey].kanji || 0);
      readingData.push(stats[dateKey].reading || 0);
      listeningData.push(stats[dateKey].listening || 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Ngữ pháp',
          data: grammarData,
          backgroundColor: CHART_COLORS.grammar,
          borderColor: CHART_COLORS.grammar,
          borderWidth: 1,
        },
        {
          label: 'Từ vựng',
          data: vocabularyData,
          backgroundColor: CHART_COLORS.vocabulary,
          borderColor: CHART_COLORS.vocabulary,
          borderWidth: 1,
        },
        {
          label: 'Kanji',
          data: kanjiData,
          backgroundColor: CHART_COLORS.kanji,
          borderColor: CHART_COLORS.kanji,
          borderWidth: 1,
        },
        {
          label: 'Đọc hiểu',
          data: readingData,
          backgroundColor: CHART_COLORS.reading,
          borderColor: CHART_COLORS.reading,
          borderWidth: 1,
        },
        {
          label: 'Nghe hiểu',
          data: listeningData,
          backgroundColor: CHART_COLORS.listening,
          borderColor: CHART_COLORS.listening,
          borderWidth: 1,
        },
      ],
    };
  }, [reviewHistory, days]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
            return `Tổng: ${total} mục`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;