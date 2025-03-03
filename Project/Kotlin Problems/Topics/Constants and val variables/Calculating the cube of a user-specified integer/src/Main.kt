import java.util.*

fun main(args: Array<String>) {
    val scanner = Scanner(System.`in`)

    // Get user input 
    val userInput = scanner.nextInt()

    // Calculate the cube of userInput
    val cube = userInput * userInput * userInput
    // Print the result
    println(cube)
}