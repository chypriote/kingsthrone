export type RegularTasks = { //daily or weekly
	countdown: number
	rwds: {id: number, rwd: number}
	score: number
	tasks: {id: number, num: number, rwd: number}
}
