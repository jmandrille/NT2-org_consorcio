<script>
    import { Doughnut } from 'vue-chartjs'

    export default {
        extends: Doughnut,
        props:['chartData','options'],
        mounted () {
            console.log(this.chartData);
            this.renderChart(this.chartData, this.options)
        }
    };
</script>
