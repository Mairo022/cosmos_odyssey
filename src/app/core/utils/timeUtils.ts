export function getTimegap(start: string, end: string): string {
    const startDT = new Date(start)
    const endDT = new Date(end)

    const gapInMin = (endDT.getTime() - startDT.getTime()) / (1000 * 60)
    const gap = formatTime(gapInMin)

    return gap
}
  
export function formatTime(timeMinutes: number): string {
    const weekInMin = 10080
    const dayInMin = 1440
    const hourInMin = 60

    const timeWeeks = timeMinutes >= weekInMin ? Math.floor(timeMinutes / weekInMin) : 0
    const timeDays = timeMinutes >= dayInMin ? Math.floor(timeMinutes / dayInMin) : 0
    const timeHours = timeMinutes >= hourInMin ? Math.floor(timeMinutes / hourInMin) : 0

    if (timeWeeks > 0) {
      const daysLeft = timeDays - timeWeeks * 7
      if (daysLeft === 0) return `${timeWeeks}w`
      return `${timeWeeks.toFixed(0)}w ${daysLeft.toFixed(0)}d`
    }
    if (timeDays > 0) {
      const hoursLeft = timeHours - timeDays * 24
      if (hoursLeft === 0) return `${timeDays}d`
      return `${timeDays.toFixed(0)}d ${hoursLeft.toFixed(0)}h`
    }
    if (timeHours > 0) {
      const minsLeft = timeMinutes - timeHours * 60
      if (minsLeft === 0) return `${timeHours}h`
      return `${timeHours.toFixed(0)}h ${minsLeft.toFixed(0)}min`
    }

    return `${timeMinutes.toFixed(0)}min`
}