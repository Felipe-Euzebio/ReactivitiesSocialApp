using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    // [ApiController] attribute is used to indicate that the controller is an API controller.

    // [Route("api/[controller]")] attribute is used to indicate the route of the controller.
    // [Route("api/[controller]")] means that the route of the controller is api/[controller].
    // [controller] is a placeholder for the name of the controller.
    // For example, if the name of the controller is ActivitiesController, then the route of the controller is api/Activities.

    [ApiController]                 
    [Route("api/[controller]")]     
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            if (result.IsSuccess && result.Value == null) return NotFound();

            return BadRequest(result.Error);
        }
    }
}