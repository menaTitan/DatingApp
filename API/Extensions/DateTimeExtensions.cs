using System;
namespace DatingApp.API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dob)
        {
            var age = DateTime.Now.Year - dob.Year;  
            if (DateTime.Now.DayOfYear < dob.DayOfYear)  --age;
            return age;
        }
    }
}