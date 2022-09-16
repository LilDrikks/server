//"18:00" --> ["18,"00"] (split) --> [18, 00] (map) = [hours, minutes] (hours = 18/ minutes = 00)

export default function convertHourStringToMinutes(hourString: string) {

    const [hours, minutes] = hourString.split(':').map(Number);

    const minutesAmount = (hours * 60) + minutes;

    return minutesAmount;
}