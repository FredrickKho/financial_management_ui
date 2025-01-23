import { useEffect, useState } from 'react';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement
);

const DashboardPage = () => {
	document.title="Nelvonce - Dashboard"
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const [spendingInvoice, setSpendingInvoice] = useState(null);
	const [earningInvoice, setEarningInvoice] = useState(null);
	const [totalPriceSum, setTotalPriceSum] = useState(null);
	const [categoryList, setCategoryList] = useState(null);
	const [invoiceChartSetup, setInvoiceChartSetup] = useState(null);
	const [incomeBarChartSetup, setIncomeBarCharSetup] = useState(null);
	const changeNumberFormat = (number) => {
		const formattedNumber = number.toLocaleString('id-ID');
		return `Rp ${formattedNumber}`;
	};
	function getRandomRGB() {
		const r = Math.floor(Math.random() * 256);
		const g = Math.floor(Math.random() * 256);
		const b = Math.floor(Math.random() * 256);
		return `rgb(${r}, ${g}, ${b})`;
	}
	const fetchInvoice = async () => {
		const url = new URL(
			`${process.env.REACT_APP_API_URL}/api/item/getAccountItemWithoutPagination`
		);
		try {
			let response = await fetch(url, {
				method: 'GET',
				credentials: 'include',
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			let result = await response.json(); // Parse JSON
			setData(result.data);
			setEarningInvoice(result.data.filter((item) => item.type === 'Earning'));
			setSpendingInvoice(
				result.data.filter((item) => item.type === 'Spending')
			);
			if (result.data) {
				const typePrice = result.data.reduce(
					(acc, item) => {
						const itemIndex = acc.findIndex((i) => i.type === item.type);
						if (itemIndex !== -1) {
							acc[itemIndex].totalPrice += item.totalPrice;
						}
						return acc;
					},
					[
						{ type: 'Earning', totalPrice: 0 },
						{ type: 'Spending', totalPrice: 0 },
					]
				);
				setTotalPriceSum(typePrice);
			}
			response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/x-item/category`
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			result = await response.json();
			setCategoryList(result.data);
		} catch (error) {
			console.error(error.message);
		}
	};
	useEffect(() => {
		const chartJs = document.createElement('script');
		chartJs.src = 'https://cdn.jsdelivr.net/npm/chart.js';
		chartJs.async = true;
		document.head.appendChild(chartJs);
		return () => {
			// Cleanup the scripts if needed
			document.head.removeChild(chartJs);
		};
	}, []);
	useEffect(() => {
		setLoading(true);
		fetchInvoice();
	}, []);

	useEffect(() => {
		if (data && categoryList) {
			const invoiceChartData = data.reduce((acc, item) => {
				// Find if the category is already in the accumulator array
				const existingCategory = acc.find(
					(cat) => cat.category === item.category
				);
				if (existingCategory) {
					// Increment count if category already exists
					existingCategory.count += 1;
				} else {
					// Otherwise, add a new entry for the category
					acc.push({ count: 1, category: item.category });
				}

				return acc;
			}, []);
			//   console.log(invoiceChartData)
			setInvoiceChartSetup({
				labels: invoiceChartData.map((item) => item.category),
				datasets: [
					{
						label: 'Total invoices',
						data: invoiceChartData.map((item) => item.count),
						backgroundColor: invoiceChartData.map(() => getRandomRGB()),
						borderColor: ['white'],
						borderWidth: 1,
					},
				],
			});
			const incomeBarChartData = data.reduce((acc, item) => {
				const existingCategory = acc.find(
					(cat) => cat.category === item.category
				);
				if (existingCategory) {
					// Increment count if category already exists
					if (item.type === 'Earning')
						existingCategory.earning += item.totalPrice;
					else existingCategory.spending += item.totalPrice;
				} else {
					// Otherwise, add a new entry for the category
					acc.push({
						category: item.category,
						spending: item.type === 'Spending' ? item.totalPrice : 0,
						earning: item.type === 'Earning' ? item.totalPrice : 0,
					});
				}
				return acc;
			}, []);
			// console.log(incomeBarChartData);
			setIncomeBarCharSetup({
				labels: incomeBarChartData.map((item) => item.category),
				datasets: [
					{
						label: 'Total spending',
						data: incomeBarChartData.map((item) => item.spending),
						backgroundColor: ['rgba(255, 99, 132, 1)'],
						borderColor: ['rgba(255, 99, 132, 1)'],
						borderWidth: 1,
					},
					{
						label: 'Total earning',
						data: incomeBarChartData.map((item) => item.earning),
						backgroundColor: ['rgba(36, 232, 22,1)'],
						borderColor: ['rgba(36, 232, 22,1)'],
						borderWidth: 1,
					},
				],
			});
		}
	}, [data, categoryList]);
	useEffect(() => {
		if (data && totalPriceSum && invoiceChartSetup && incomeBarChartSetup)
			setLoading(false);
	}, [data, totalPriceSum, invoiceChartSetup,incomeBarChartSetup]);
	useEffect(() => {});
	if (loading)
		return (
			<div className="content-wrapper d-flex justify-content-center flex-column align-items-center">
				<div
					className="spinner-border"
					role="status">
					<span className="visually-hidden"></span>
				</div>
			</div>
		);
	return (
		<div className="content-wrapper px-4 py-2">
			<div className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1
								className="m-0"
								style={{ fontSize: '1.8rem' }}>
								Dashboard
							</h1>
						</div>
					</div>
				</div>
			</div>
			<section className="content">
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-3 col-6">
							<div className="small-box bg-info">
								<div className="inner">
									<h5>{data.length}</h5>

									<p>Total Invoices</p>
								</div>
								<div className="icon">
									<i className="fas fa-file-invoice"></i>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-success">
								<div className="inner">
									<h5>{changeNumberFormat(totalPriceSum[0].totalPrice)}</h5>
									<p>Total Earning</p>
								</div>
								<div className="icon">
									<i className="fa-solid fa-arrow-trend-up"></i>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-danger">
								<div className="inner">
									<h5>{changeNumberFormat(totalPriceSum[1].totalPrice)}</h5>
									<p>Total Spending</p>
								</div>
								<div className="icon">
									<i className="fa-solid fa-arrow-trend-down"></i>
								</div>
							</div>
						</div>
						<div className="col-lg-3 col-6">
							<div className="small-box bg-gray-dark">
								<div className="inner">
									{totalPriceSum[0].totalPrice - totalPriceSum[1].totalPrice <
									0 ? (
										<h5 className="text-warning mr-1">
											<i className="fas fa-arrow-down"></i>{' '}
											{changeNumberFormat(
												Math.abs(
													totalPriceSum[0].totalPrice -
														totalPriceSum[1].totalPrice
												)
											)}
										</h5>
									) : (
										<h5 className="text-success mr-1">
											<i className="fas fa-arrow-up"></i>{' '}
											{changeNumberFormat(
												totalPriceSum[0].totalPrice -
													totalPriceSum[1].totalPrice
											)}
										</h5>
									)}
									<p>Overall</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="card card-danger">
								<div className="card-header">
									<h3 className="card-title">Invoice per category</h3>
									<div className="card-tools">
										<button
											type="button"
											className="btn btn-tool"
											data-card-widget="collapse">
											<i className="fas fa-minus"></i>
										</button>
									</div>
								</div>
								<div className="card-body">
									<div className="chartjs-size-monitor">
										<div className="chartjs-size-monitor-expand">
											<div className=""></div>
										</div>
										<div className="chartjs-size-monitor-shrink">
											<div className=""></div>
										</div>
									</div>
									<Pie
										style={{
											minHeight: '250px',
											height: '250px',
											maxHeight: '250px',
											maxWidth: '100%',
										}}
										options={{ responsive: true, maintainAspectRatio: false }}
										data={invoiceChartSetup}></Pie>
								</div>
							</div>
							<div className="card">
								<div className="card-header border-0">
									<h3 className="card-title">Top 5 Most Big Spending Invoice</h3>
									<div className="card-tools">
										<button
											type="button"
											className="btn btn-tool"
											data-card-widget="collapse">
											<i className="fas fa-minus"></i>
										</button>
									</div>
								</div>
								<div className="card-body table-responsive p-0">
									<table className="table table-striped table-valign-middle">
										<thead>
											<tr>
												<th>No.</th>
												<th>Name</th>
												<th>Price</th>
												<th>Date</th>
											</tr>
										</thead>
										<tbody>
											{spendingInvoice
												.sort((a, b) => b.totalPrice - a.totalPrice)
												.slice(0, 5)
												.map((item, i) => {
													return (
														<tr>
															<td>{i + 1}</td>
															<td>{item.name}</td>
															<td>{changeNumberFormat(item.totalPrice)}</td>
															<td>{item.date}</td>
														</tr>
													);
												})}
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="card card-success">
								<div className="card-header">
									<h3 className="card-title">
										Total earning and spending per category
									</h3>
									<div className="card-tools">
										<button
											type="button"
											className="btn btn-tool"
											data-card-widget="collapse">
											<i className="fas fa-minus"></i>
										</button>
									</div>
								</div>
								<div className="card-body">
									<div className="chartjs-size-monitor">
										<div className="chartjs-size-monitor-expand">
											<div className=""></div>
										</div>
										<div className="chartjs-size-monitor-shrink">
											<div className=""></div>
										</div>
									</div>
									<Bar
										id="barChart"
										options={{
											responsive: true,
											maintainAspectRatio: false,
											datasetFill: false,
										}}
										style={{
											minHeight: '250px',
											height: '250px',
											maxHeight: '250px',
											maxWidth: '100%',
										}}
										data={incomeBarChartSetup}></Bar>
								</div>
							</div>
							<div className="card">
								<div className="card-header border-0">
									<h3 className="card-title">Top 5 Most Big Earning Invoice</h3>
									<div className="card-tools">
										<button
											type="button"
											className="btn btn-tool"
											data-card-widget="collapse">
											<i className="fas fa-minus"></i>
										</button>
									</div>
								</div>
								<div className="card-body table-responsive p-0">
									<table className="table table-striped table-valign-middle">
										<thead>
											<tr>
												<th>No.</th>
												<th>Name</th>
												<th>Price</th>
												<th>Date</th>
											</tr>
										</thead>
										<tbody>
											{earningInvoice
												.sort((a, b) => b.totalPrice - a.totalPrice)
												.slice(0, 5)
												.map((item, i) => {
													return (
														<tr>
															<td>{i + 1}</td>
															<td>{item.name}</td>
															<td>{changeNumberFormat(item.totalPrice)}</td>
															<td>{item.date}</td>
														</tr>
													);
												})}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
export default DashboardPage;
