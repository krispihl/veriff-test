import React, { useEffect, useState, useCallback } from "react";
import { fetchChecks, submitCheckResults } from "./api";
import { ListItem } from "./components/ListItem";
import { Button } from "./components/Button";
import { ErrorView } from "./views/Error";
import { SuccessView } from "./views/Success";
import { Check } from './types'
import "./global.css";

const App = () => {
	const [checks, setChecks] = useState<Check[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(true);

	// Fetch data with API call
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response: Check[] = await fetchChecks();

				const sorted = response.sort((a, b) => a.priority - b.priority);
				const modified = sorted.map((check, idx) => {
					return {
						...check,
						active: false,
						disabled: idx === 0 ? false : true,
					};
				});

				setChecks(modified);
			} catch (error) {
				setIsError(true);
			}

			setIsLoading(false);
		};

		fetchData();
	}, []);

	// Update checks based on user keypress events
	const handleArrowUp = useCallback(
		(activeItemIndex: number) => {
			if (activeItemIndex !== 0) {
				const modified = checks.map((check, idx) => {
					return {
						...check,
						active: idx === activeItemIndex - 1 ? true : false,
					};
				});

				setChecks(modified);
			}
		},
		[checks]
	);

	const handleArrowDown = useCallback(
		(activeItemIndex: number) => {
			if (activeItemIndex !== checks.length - 1 && !checks[activeItemIndex + 1].disabled) {
				const modified = checks.map((check, idx) => {
					return {
						...check,
						active: idx === activeItemIndex + 1 ? true : false,
					};
				});

				setChecks(modified);
			}
		},
		[checks]
	);

	const handleOne = useCallback(
		(activeItemIndex: number) => {
			const modified = checks.reduce((previousValue, currentValue, currentIndex) => {
				const modifiedCheck = [{
					...currentValue,
					value: currentIndex === activeItemIndex ? 'yes' : currentValue.value,
					disabled:
					currentIndex <= activeItemIndex ||
					currentIndex === activeItemIndex + 1 ||
					// handling edge case when user goes back and changes one of the previous values to NO and then back to YES
					(currentIndex >= activeItemIndex + 2 && previousValue[currentIndex - 1].value === 'yes' && !previousValue[currentIndex - 1].disabled)
						? false
						: true,
				}]

				return previousValue.concat(modifiedCheck);
			}, [] as Check[]);

			setChecks(modified);
		},
		[checks]
	);

	const handleTwo = useCallback(
		(activeItemIndex: number) => {
			const modified = checks.map((check, idx) => {
				return {
					...check,
					value: idx === activeItemIndex ? 'no' : check.value,
					disabled: idx <= activeItemIndex ? false : true,
				};
			});

			setChecks(modified);
		},
		[checks]
	);

	const handleKeyPress = useCallback(
		(event) => {
			if(['ArrowUp', 'ArrowDown'].indexOf(event.code) > -1) {
				event.preventDefault();
			};

			const activeItemIndex = checks.findIndex((check) => check.active);

			switch (event.key) {
				case 'ArrowUp':
					handleArrowUp(activeItemIndex);
					break;
				case 'ArrowDown':
					handleArrowDown(activeItemIndex);
					break;
				case '1':
					handleOne(activeItemIndex);
					break;
				case '2':
					handleTwo(activeItemIndex);
					break;
				default:
					return;
			}
		},
		[checks, handleArrowUp, handleArrowDown, handleOne, handleTwo]
	);

	// Attach event listener for keydown event
	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	// Update checks based on user click event
	const updateChecks = useCallback(
		(value: string, id: string) => {
			const activeItemIndex = checks.findIndex((x) => x.id === id);

			const updatedChecks = checks.reduce((previousValue, currentValue, currentIndex) => {
				const modifiedCheck = [{
					...currentValue,
					active: currentIndex === activeItemIndex ? true : false,
					disabled:
					currentIndex <= activeItemIndex ||
					(currentIndex === activeItemIndex + 1 && value === 'yes') ||
					// handling edge case when user goes back and changes one of the previous values to NO and then back to YES
					(currentIndex >= activeItemIndex + 2 && previousValue[currentIndex - 1].value === 'yes' && !previousValue[currentIndex - 1].disabled)
						? false
						: true,
					value: currentIndex === activeItemIndex ? value : currentValue.value,
				}]

				return previousValue.concat(modifiedCheck);
			}, [] as Check[]);

			setChecks(updatedChecks);
		},
		[checks]
	);

	// Submit button logic
	useEffect(() => {
		setButtonDisabled(true);
		const values = checks.map((check) => check.value);

		const allChecksYes = values.length && values.every((value) => value && value === 'yes');
		const someCheckNo = values.includes('no');

		if (allChecksYes || someCheckNo) {
			setButtonDisabled(false);
		}
	}, [checks]);

	// Submit check results
	const handleSubmit = useCallback(async () => {
		const submitData = checks.map((check) => {
			return {
				checkId: check.id,
				value: check.value || 'not selected',
			};
		});

		try {
			await submitCheckResults(submitData);
			setIsSuccess(true);

			console.log('submitData', submitData);
		} catch (error) {
			setIsError(true);
		}
	}, [checks]);

	return (
		<div className='app'>
			{isLoading && <p className='loadingState'>Loading...</p>}
			{isSuccess && <SuccessView />}
			{isError && <ErrorView />}
			{!isLoading && !isSuccess && !isError && (
			<div className='wrapper'>
				<form>
					{checks.map((check, idx) => {
						return (
							<ListItem
								key={check.id}
								check={check}
								updateChecks={updateChecks}
							/>
						);
					})}
				</form>
				<Button disabled={buttonDisabled} onClick={handleSubmit}>
					Submit
				</Button>
			</div>
			)}
		</div>
	);
};

export default App;
